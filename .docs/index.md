---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Alfred-Workflows"
  text: "Save time, Improve life."
  tagline: 🚀 ☕️ 💻
  image:
    src: /appicon.png
    alt: "Alfred"
  actions:
    - theme: brand
      text: Workflows
      link: /workflows
    - theme: alt
      text: GitHub
      link: https://github.com/alanhe421/alfred-workflows

features:
  - title: 2FA-Read Code
    details: Read authentication code in your recent messages or current clipboard
    link: workflows/2fa-read-code/2fa-read-code.html
    icon:
      src: /2fa-read-code-icon.png
  - title: About Mac
    details: Displays system information about your Mac
    link: workflows/about-mac/about-mac.html
    icon:
      src: /about-mac-icon.png
  - title: OCR
    details: Activate OCR keywords, select the screen area, and press Enter to immediately obtain the text
    link: workflows/ocr/ocr.html
    icon:
      src: /ocr-icon.png
  - title: AppID
    details: Show ID, Version, Icon of installed apps
    link: workflows/appid/appid.html
    icon:
      src: /appid-icon.png
  - title: QR Reader
    details: Read QR Code
    link: workflows/qr-reader/qr-reader.html
    icon:
      src: /qr-reader-icon.png
  - title: Open Chrome Profile
    details: Get all available chrome profiles and open the selected
    link: workflows/open-chrome-profile/open-chrome-profile.html
    icon:
      src: /open-chrome-profile-icon.png
---

<HomeUnderline />
