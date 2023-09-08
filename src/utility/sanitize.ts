export function trimSpace(input: string | null | undefined): string {
  return input ? input.trim() : '';
}

export function trimDataObject(input: object): object {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => {
      if (typeof value === 'string') {
        return [key, value.trim()];
      }
      return [key, value];
    })
  );
}
