import {
    DocsLayout,
    DocsSection,
    DocsCode,
    DocsLink,
} from "../_components/docs";
import { ComponentPreview } from "../_components/component-preview";
import { ProximityMapExample } from "../_components/examples/proximity-map-example";
import { GoogleProximityMapExample } from "../_components/examples/google-proximity-map-example";
import { getExampleSource } from "@/lib/get-example-source";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Proximity Map",
    description: "Visualize distance and proximity between multiple locations.",
};

export default function ProximityPage() {
    const exampleSource = getExampleSource("proximity-map-example.tsx");
    const googleExampleSource = getExampleSource("google-proximity-map-example.tsx");

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

            <DocsSection title="Google Maps Route Mesh">
                <p>
                    For more accurate travel calculations, you can use the <DocsCode>GoogleProximityMap</DocsCode> wrapper.
                    This component uses the Google Directions API to fetch the actual route between every pair of points.
                </p>
                <div className="bg-muted p-4 rounded-lg my-4 text-sm font-mono">
                    {`// Note: N points = N*(N-1)/2 API requests. Use with caution.`}
                </div>
                <p>
                    It renders the actual route polyline and displays the travel distance and duration.
                </p>
            </DocsSection>

            <ComponentPreview code={googleExampleSource}>
                <GoogleProximityMapExample />
            </ComponentPreview>
        </DocsLayout>
    );
}
