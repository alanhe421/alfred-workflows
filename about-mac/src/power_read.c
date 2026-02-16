#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <CoreFoundation/CoreFoundation.h>
#include <IOKit/IOKitLib.h>

typedef void* IOReportSubscriptionRef;
extern CFDictionaryRef IOReportCopyChannelsInGroup(CFStringRef, CFStringRef, uint64_t, uint64_t, uint64_t);
extern IOReportSubscriptionRef IOReportCreateSubscription(void*, CFDictionaryRef, CFMutableDictionaryRef*, uint64_t, CFTypeRef);
extern CFDictionaryRef IOReportCreateSamples(IOReportSubscriptionRef, CFMutableDictionaryRef, CFTypeRef);
extern CFDictionaryRef IOReportCreateSamplesDelta(CFDictionaryRef, CFDictionaryRef, CFTypeRef);
extern CFStringRef IOReportChannelGetChannelName(CFDictionaryRef);
extern int64_t IOReportSimpleGetIntegerValue(CFDictionaryRef, int);

int main() {
    CFDictionaryRef channels = IOReportCopyChannelsInGroup(CFSTR("Energy Model"), NULL, 0, 0, 0);
    if (!channels) { printf("N/A\n"); return 0; }
    CFMutableDictionaryRef sub = NULL;
    IOReportSubscriptionRef subscription = IOReportCreateSubscription(NULL, channels, &sub, 0, NULL);
    if (!subscription) { printf("N/A\n"); return 0; }
    CFDictionaryRef s1 = IOReportCreateSamples(subscription, sub, NULL);
    usleep(1000000);
    CFDictionaryRef s2 = IOReportCreateSamples(subscription, sub, NULL);
    if (!s1 || !s2) { printf("N/A\n"); return 0; }
    CFDictionaryRef delta = IOReportCreateSamplesDelta(s1, s2, NULL);
    if (!delta) { printf("N/A\n"); return 0; }
    CFArrayRef chans = CFDictionaryGetValue(delta, CFSTR("IOReportChannels"));
    if (!chans) { printf("N/A\n"); return 0; }

    // Top-level component channels to sum for total system power
    const char *components[] = {
        "CPU Energy", "GPU", "GPU SRAM", "ISP", "AVE", "MSR",
        "AMCC", "DCS", "DRAM", "DISP", "DISPEXT", "SOC_AON", NULL
    };

    double total = 0;
    for (CFIndex i = 0; i < CFArrayGetCount(chans); i++) {
        CFDictionaryRef ch = (CFDictionaryRef)CFArrayGetValueAtIndex(chans, i);
        CFStringRef name = IOReportChannelGetChannelName(ch);
        char n[256] = {0};
        CFStringGetCString(name, n, 256, kCFStringEncodingUTF8);
        for (int j = 0; components[j]; j++) {
            if (strcmp(n, components[j]) == 0) {
                int64_t val = IOReportSimpleGetIntegerValue(ch, 0);
                total += (double)val;
                break;
            }
        }
    }
    // total is in mJ over 1s interval = mW, convert to W
    printf("%.1f\n", total / 1000.0);
    CFRelease(s1); CFRelease(s2); CFRelease(delta);
    return 0;
}
