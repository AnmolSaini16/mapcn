import { ScrollView, StyleProp, View, ViewStyle } from "react-native";

import { BlockDisplay } from "./Display";

import { Footer } from "@/components/footer";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { getAllBlocks } from "@/lib/blocks";

export function BlocksPage() {
  const blocks = getAllBlocks();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="flex-grow"
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        align="left"
        size="sm"
      >
        <PageHeaderHeading>Blocks</PageHeaderHeading>
        <PageHeaderDescription>
          Pre-built, ready-to-use map blocks. Browse, preview, and copy them
          into your app with one command.
        </PageHeaderDescription>
      </PageHeader>

      <View
        className="animate-fade-up animate-stagger container gap-20 pb-20"
        style={
          {
            "--stagger": 3.5,
          } as StyleProp<ViewStyle>
        }
      >
        {blocks.map((block) => (
          <BlockDisplay
            key={block.name}
            name={block.name}
          />
        ))}
      </View>

      <Footer />
    </ScrollView>
  );
}
