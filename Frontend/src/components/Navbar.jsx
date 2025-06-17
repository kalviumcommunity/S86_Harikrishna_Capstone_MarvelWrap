import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">MarvelWrap</Link>
      <div className="flex gap-4">
        <Link to="/characters">Characters</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/comics">Comics</Link>
        <Link to="/weapons">Weapons</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}