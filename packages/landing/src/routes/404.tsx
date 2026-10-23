import { createFileRoute } from "@tanstack/react-router";
import { NotFoundPage } from "@/components/landing-page/notFoundPage";

export const Route = createFileRoute("/404")({
  component: NotFoundPage,
});
