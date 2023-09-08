export type headerTplData = {
  title: string
}

export default function headerTpl(data: headerTplData): string {
  const { title } = data;
  return `
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body>
  `;
}
