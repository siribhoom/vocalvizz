declare module "node-gtts" {
  function gtts(lang: string): {
    save: (path: string, text: string, callback?: (err?: any) => void) => void;
  };
  export default gtts;
}

declare module "fluent-ffmpeg" {
  const ffmpeg: any;
  export default ffmpeg;
}
