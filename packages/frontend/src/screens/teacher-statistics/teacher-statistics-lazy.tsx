import { lazy, Suspense } from "react";
import { FullScreenLoader } from "../../ui/full-screen-loader.tsx";

const TeacherStatisticsScreen = lazy(() =>
  import("./teacher-statistics-screen.tsx").then((module) => ({
    default: module.TeacherStatisticsScreen,
  })),
);

const TeacherStatisticsListScreen = lazy(() =>
  import("./teacher-statistics-screen.tsx").then((module) => ({
    default: module.TeacherStatisticsListScreen,
  })),
);

export function TeacherStatisticsLazy() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <TeacherStatisticsScreen />
    </Suspense>
  );
}

export function TeacherStatisticsListLazy() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <TeacherStatisticsListScreen />
    </Suspense>
  );
}
