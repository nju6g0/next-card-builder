import Link from "next/link";
import Brand from "@/components/ui/Brand";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <Brand.Vertical />
        <div className="footer-links">
          <div className="footer-column">
            <h4>產品</h4>
            <Link href="/templates">範本庫</Link>
            <Link href="/dashboard">我的邀請函</Link>
            <Link href="/invitations/create">開始設計</Link>
          </div>
          <div className="footer-column">
            <h4>關於</h4>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <span className="text-text-light block">Demo 專案</span>
            <span className="text-text-light block">純前端實作</span>
          </div>
          <div className="footer-column">
            <h4>技術</h4>
            <span className="text-accent-sage block">Next.js 16.3.7</span>
            <span className="text-accent-sage block">TypeScript 5</span>
            <span className="text-accent-sage block">Tailwind CSS v4</span>
            <span className="text-accent-sage block">Zustand 5</span>
            <span className="text-accent-sage block">Framer Motion 13</span>
            <span className="text-accent-sage block">@dnd-kit 6</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {currentYear} Cardian 卡典. 做出讓人心動的卡片</p>
      </div>
    </footer>
  );
}
