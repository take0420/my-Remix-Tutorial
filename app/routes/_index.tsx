import { Link } from '@remix-run/react';

export default function Index() {
  return (
    <p id='index-page'>
      This is Remix emblem
      <br />
      Check out <Link to='https://remix.run'>the docs at remix.run</Link>
    </p>
  );
}
