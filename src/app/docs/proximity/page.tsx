import {
    DocsLayout,
    DocsSection,
    DocsCode,
    DocsLink,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { ProximityMapExample } from "../_components/examples/proximity-map-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Proximity Map",
    description: "Visualize distance and proximity between multiple locations.",
};

export default function ProximityPage() {
    const exampleSource = getExampleSource("proximity-map-example.tsx");

    return (
        <DocsLayout
            title="Proximity Map"
            description="Calculate and visualize distances between a set of locations using a mesh network."
            prev={{ title: "Advanced Usage", href: "/docs/advanced-usage" }}
        >
            <DocsSection>
                <p>
                    The <DocsCode>ProximityMap</DocsCode> component is perfect for
                    visualizing relationships between multiple points of interest. It
                    automatically calculates the distance between every pair of points and
                    renders a dotted line connection. uses Haversine formula to calculate
                    distances.
                </p>
            </DocsSection>

            <ComponentPreview code={exampleSource}>
                <ProximityMapExample />
            </ComponentPreview>
        </DocsLayout>
    );
}
