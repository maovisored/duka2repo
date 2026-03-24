import { useEffect, useState } from "react";

export default function Footer() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="app-footer">
      <div>
        {time.toLocaleDateString()} · {time.toLocaleTimeString()}
      </div>

      <div>
        <p>Made by AnteDot Africa</p>
          <span>© {new Date().getFullYear()} </span>
      </div>
    </footer>
  );
}