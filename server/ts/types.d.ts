type quentry = {
  url: string;
  id: string;
};

type vinfo = {
  title: string;
  duration: number;
};

declare module "*.json" {
  const value: any;
  export default value;
}
