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
      {/* LEFT */}
      <div className="footer-left">
        <div className="footer-time">
          {time.toLocaleDateString()} · {time.toLocaleTimeString()}
        </div>
      </div>

      {/* CENTER */}
      <div className="footer-center">
        <span className="footer-brand">AnteDot Africa</span>
      </div>

      {/* RIGHT */}
      <div className="footer-right">
        <div className="footer-links">
          <a href="#">Privacy</a>
          <span>·</span>
          <a href="#">Terms</a>
        </div>

        <span className="footer-meta">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}