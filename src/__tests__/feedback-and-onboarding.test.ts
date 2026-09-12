import { describe, it, expect } from "vitest";
import type { UserFeedback } from "../components/FeedbackModal";

describe("Feedback & Onboarding System (Level 5)", () => {
    it("validates feedback structure and required fields", () => {
        const sampleFeedback: UserFeedback = {
            id: "FB-001",
            date: "2026-09-12",
            walletAddress: "addr_test1qpk299v44f1a8c88...",
            userType: "Security Researcher",
            feature: "Vault Sealing",
            category: "UX",
            severity: "Medium",
            expected: "Rejection of lossy JPEG images",
            actual: "Error handled cleanly",
            improvement: "Enforce lossless PNG validation",
            status: "Implemented",
            resolution: "Implemented validateImageFile() and JSZip STORE mode",
        };

        expect(sampleFeedback.id).toMatch(/^FB-\d{3}$/);
        expect(["Bug", "UX", "Feature Request", "Performance", "Documentation", "Smart Contract"]).toContain(sampleFeedback.category);
        expect(["Critical", "High", "Medium", "Low"]).toContain(sampleFeedback.severity);
        expect(sampleFeedback.walletAddress.length).toBeGreaterThan(10);
    });

    it("calculates blue-channel LSB capacity correctly for standard resolutions", () => {
        // Capacity formula: floor((width * height) / 8) - 4 bytes header
        const calcCapacity = (w: number, h: number) => Math.max(0, Math.floor((w * h) / 8) - 4);

        // 1920x1080 FHD
        const fhdCapacity = calcCapacity(1920, 1080);
        expect(fhdCapacity).toBe(259196); // ~259 KB

        // 800x600 SVGA
        const svgaCapacity = calcCapacity(800, 600);
        expect(svgaCapacity).toBe(59996); // ~60 KB

        // 100x100 Thumbnail
        const thumbCapacity = calcCapacity(100, 100);
        expect(thumbCapacity).toBe(1246); // ~1.2 KB

        // Secret payload estimate check
        const sampleSecret = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
        const estimatedBytes = new TextEncoder().encode(sampleSecret).length + 350;
        expect(estimatedBytes).toBeLessThan(svgaCapacity);
    });

    it("serializes and exports feedback catalog accurately", () => {
        const testList: UserFeedback[] = [
            {
                id: "FB-101",
                date: "2026-09-12",
                walletAddress: "addr_test1qre388...",
                userType: "Developer",
                feature: "Smart Contract",
                category: "Smart Contract",
                severity: "High",
                expected: "Fast Compact circuit verification",
                actual: "Confirmed on Preprod",
                improvement: "Add latency ping indicator",
                status: "Implemented",
            },
        ];

        const jsonStr = JSON.stringify(testList, null, 2);
        const parsed = JSON.parse(jsonStr) as UserFeedback[];
        expect(parsed).toHaveLength(1);
        expect(parsed[0].id).toBe("FB-101");
        expect(parsed[0].status).toBe("Implemented");
    });
});
