#!/usr/bin/swift
//
//  QResolve.swift
//  Launch URL from QR Code
//
//  Created by Patrick Sy on 08/05/2023.
//
import CoreImage

struct QResolver {
    static let fileManager: FileManager = .default
    static func run(with qrPath: String) -> Never {
        if let snap: CIImage = fileManager.getSnap(qrPath: qrPath),
           let detector = CIDetector.QuickResponse()
        {
            for feature in detector.features(in: snap) where feature is CIQRCodeFeature {
                guard let feature = feature as? CIQRCodeFeature,
                      let landingPage: String = feature.messageString
                else {
                    preconditionFailure()
                }
                fileManager.removeSnap(qrPath: qrPath)
                print(landingPage)
                exit(0)
            }
        }
        print("Failure: Unable to recognize QR Code")
        exit(1)
    }
}

extension FileManager {
    @discardableResult
    func getSnap(qrPath: String) -> CIImage? {
        guard fileExists(atPath: qrPath) else {
            if let received: String = ProcessInfo.processInfo.environment["qr"] {
                return CIImage(contentsOf: URL(fileURLWithPath: received))
            }
            print("Failure: Nothing to recognize")
            exit(1)
        }
        return CIImage(contentsOf: URL(fileURLWithPath: qrPath))
    }
    
    func removeSnap(qrPath: String) {
        try? removeItem(atPath: qrPath)
    }
}


extension CIDetector {
    static func QuickResponse() -> CIDetector? {
        .init(ofType: CIDetectorTypeQRCode, context: nil, options: nil)
    }
}


// Check if the file path was passed as a command line argument
guard CommandLine.arguments.count > 1 else {
    print("Failure: Please provide a file path")
    exit(1)
}

let qrPath = CommandLine.arguments[1]
QResolver.run(with: qrPath)

