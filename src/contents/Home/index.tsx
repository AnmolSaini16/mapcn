import { Link } from "expo-router";
import { useState } from "react";
import { Platform, ScrollView, StyleProp, View, ViewStyle } from "react-native";

import { ExamplesGrid } from "./ExamplesGrid";
import { GetTheApp } from "./GetTheApp";

import { Footer } from "@/components/footer";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { AgentPrompt } from "@/contents/Home/AgentPrompt";
import { ParentScrollLockProvider } from "@/lib/parent-scroll-lock";

export const HomePage = () => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ParentScrollLockProvider setScrollEnabled={setScrollEnabled}>
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        <PageHeader>
          <PageHeaderHeading>Beautiful maps, made simple</PageHeaderHeading>
          <PageHeaderDescription>
            Ready to use, customizable map components for React Native. Built on
            MapLibre. Styled with Tailwind.
          </PageHeaderDescription>

          <PageActions className="mt-5 flex-col gap-4">
            <View className="flex-row flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs"
                asChild
              >
                <Button className="min-w-36 justify-center">
                  <Text>Get Started</Text>
                </Button>
              </Link>

              <Link
                href="/docs/basic-map"
                asChild
              >
                <Button
                  variant="outline"
                  className="min-w-36 justify-center"
                >
                  <Text>View Components</Text>
                </Button>
              </Link>
            </View>

            <AgentPrompt />
          </PageActions>
        </PageHeader>

        <View
          className="animate-fade-up animate-stagger mx-auto w-full flex-1 container"
          style={
            {
              "--stagger": 4.5,
            } as StyleProp<ViewStyle>
          }
        >
          {Platform.OS === "web" ? <GetTheApp /> : <ExamplesGrid />}
        </View>

        <Footer />
      </ScrollView>
    </ParentScrollLockProvider>
  );
};
