import { Redirect } from 'expo-router';

/** Unknown paths (e.g. an old deep link) go back to the entry screen. */
export default function NotFound() {
  return <Redirect href="/" />;
}
