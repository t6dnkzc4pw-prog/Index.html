import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { Emotion } from "@/components/sections/Emotion";
import { Sense } from "@/components/sections/Sense";
import { Scenes } from "@/components/sections/Scenes";
import { Roots } from "@/components/sections/Roots";
import { Epilogue } from "@/components/sections/Epilogue";
import { Inquiry } from "@/components/sections/Inquiry";

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Emotion />
      <Sense />
      <Scenes />
      <Roots />
      <Epilogue />
      <Inquiry />
    </>
  );
}
