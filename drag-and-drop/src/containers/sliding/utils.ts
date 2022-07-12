export const rowColumnOf = (position: number, columns: number) => {
  const col = position % columns;
  const row = Math.floor(position / columns);
  return { row, col };
};

export const coordinateOf = (
  { row, col }: { row: number; col: number }
) => {
  return {
    x: col * 128,
    y: row * 128,
  };
};

export const withPositions = <
  T = Array<{ position: number; width: number; [k: string]: any }>
>(
  items: T,
  columns: number
): T => {
  let i = 0;
  let r = columns;
  return (items as any).map((item: any) => {
    let position = 0;
    if (r < item.width) {
      i += r;
      r = columns;
    }
    position = i;
    i += item.width;
    r -= item.width;
    return { ...item, position: position };
  });
};

export const getPositionToIndex = <
  T = Array<{ position: number; width: number; [k: string]: any }>
>(
  items: T,
  columns: number
) => {
  const ret: Record<number, number> = {};
  let p = 0;
  let r = columns;
  (items as any).forEach((item: any, i: number) => {
    if (r < item.width) {
      for (let j = 0; j < r; j++) {
        ret[p] = -1;
        p++;
      }
      r = columns;
    }
    for (let j = 0; j < item.width; j++) {
      ret[p] = i;
      p++;
      r--;
    }
  });
  return ret;
};

export const animate = <
  T = Array<{ index: number; position: number; width: number; [k: string]: any }>
>(
  items: T,
  columns: number,
  previous?: T,
  x?: number,
  y?: number,
  current?: number,
  active?: boolean
) => {
  return (index: number) => {
    if (current === index && active) {
      const z = coordinateOf({
        ...rowColumnOf(
          (previous || items as any).find((a: any) => a.index === current)!.position,
          columns
        )
      });
      return {
        x: (x || 0) + z.x,
        y: (y || 0) + z.y,
        scale: 1.1,
        zIndex: 10,
        immediate: (n: any) =>
          n === "y" || n === "zIndex" || n === "x" || n === "background"
      };
    } else {
      const z = coordinateOf({
        ...rowColumnOf(
          (items as any).find((a: any) => a.index === index)!.position,
          columns
        )
      });
      return {
        ...z,
        zIndex: 1,
        scale: 1,
        background: "transparent"
      };
    }
  };
};
