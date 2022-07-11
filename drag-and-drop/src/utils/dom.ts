export const isInside = (
  element: HTMLElement,
  coord: { left: number; right?: number; top: number; bottom?: number }
) => {
  const { left, right, bottom, top } = element.getBoundingClientRect();
  if (!coord.right || !coord.bottom) {
    if (coord.left > right || coord.left < left)
      return false;
    if (coord.top > bottom || coord.top < top)
      return false;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  } else if (
    coord.left < left ||
    coord.top < top ||
    coord.right! > right ||
    coord.bottom! > bottom
  ) return false;
  return true;
};

