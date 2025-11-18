export default function randomIP() {
  const r = () => Math.floor(Math.random() * 256);
  return `${r()}.${r()}.${r()}.${r()}`;
}
