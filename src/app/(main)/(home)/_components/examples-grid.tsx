import {
  AnalyticsExample,
  DeliveryExample,
  EVChargingExample,
  TrailExample,
  FlyToExample,
  ArcExample,
} from "./examples/index";

export function ExamplesGrid() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsExample />
        <TrailExample />
        <ArcExample />
        <EVChargingExample />
        <FlyToExample />
        <DeliveryExample />
      </div>

      <p className="text-muted-foreground mt-3 text-right text-xs">
        Map data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          OpenStreetMap
        </a>{" "}
        contributors · ©{" "}
        <a
          href="https://carto.com/attributions"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          CARTO
        </a>
      </p>
    </div>
  );
}
