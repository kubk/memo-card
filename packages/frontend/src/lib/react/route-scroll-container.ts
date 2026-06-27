const routeScrollContainerAttribute = "data-route-scroll-container";
const routeScrollContainerSelector = `[${routeScrollContainerAttribute}]`;

export const routeScrollContainerProps = {
  [routeScrollContainerAttribute]: "",
};

export function getRouteScrollElement() {
  return (
    document.querySelector<HTMLElement>(routeScrollContainerSelector) ??
    document.scrollingElement
  );
}
