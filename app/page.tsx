import Link from "next/link";
import { Button } from "@/components/ui/Button";
import HomeClientAuth from "@/components/home/HomeClientAuth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cardian 卡典 - 用心設計每一份邀請",
  description:
    "為生命中的美好時刻，創造獨一無二的數位邀請函。精選範本、自由編輯、即時分享。",
  openGraph: {
    title: "Cardian 卡典 - 用心設計每一份邀請",
    description: "為生命中的美好時刻，創造獨一無二的數位邀請函",
    type: "website",
    locale: "zh_TW",
  },
};

export default function Home() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">手作溫度 × 數位創意</div>
          <h1 className="hero-title">
            <span className="title-line">用心設計</span>
            <span className="title-line">每一份邀請</span>
          </h1>
          <p className="hero-subtitle">
            為生命中的美好時刻，創造獨一無二的數位邀請函
          </p>
          <div className="hero-cta">
            <Link href="/invitations/create">
              <Button variant="primary" className="hidden sm:block">
                開始設計
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="browse-templates">瀏覽範本</Button>
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="card-mockup card-1">
            <div className="mockup-header">婚禮邀請</div>
            <div className="mockup-content"></div>
          </div>
          <div className="card-mockup card-2">
            <div className="mockup-header">生日派對</div>
            <div className="mockup-content"></div>
          </div>
          <div className="card-mockup card-3">
            <div className="mockup-header">寶寶滿月</div>
            <div className="mockup-content"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">為什麼選擇我們</h2>
          <p className="section-subtitle">簡單三步驟，輕鬆完成專屬邀請函</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3 className="feature-title">精選範本</h3>
            <p className="feature-desc">
              超過百款手繪插畫風格範本，每一款都充滿溫度與故事
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">自由編輯</h3>
            <p className="feature-desc">
              直覺式拖拉編輯器，文字、圖片、配色隨心所欲調整
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3 className="feature-title">即時分享</h3>
            <p className="feature-desc">
              一鍵生成專屬連結，透過社群媒體輕鬆傳遞邀請
            </p>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="showcase">
        <h2 className="section-title">精選作品</h2>
        <div className="showcase-grid">
          <Link
            href="/templates/wedding-animated-restricted"
            className="showcase-item item-1"
          >
            <div className="showcase-overlay">
              <span className="showcase-category">婚禮</span>
            </div>
          </Link>
          <Link
            href="/templates/party-animated-restricted"
            className="showcase-item item-2"
          >
            <div className="showcase-overlay">
              <span className="showcase-category">派對</span>
            </div>
          </Link>
          <div className="showcase-item item-3">
            <div className="showcase-overlay">
              <span className="showcase-category">慶生</span>
            </div>
          </div>
          <div className="showcase-item item-4">
            <div className="showcase-overlay">
              <span className="showcase-category">滿月</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section hidden sm:block">
        <div className="cta-content">
          <h2 className="cta-title">準備好開始了嗎？</h2>
          <p className="cta-subtitle">讓我們一起為重要的日子，留下美好的記憶</p>
          <Link href="/invitations/create">
            <Button variant="primary" size="large">
              免費開始設計
            </Button>
          </Link>
        </div>
        <div className="cta-decoration">
          <div className="deco-circle circle-1"></div>
          <div className="deco-circle circle-2"></div>
          <div className="deco-circle circle-3"></div>
        </div>
      </section>

      {/* Client-side auth check (hidden component for auth state) */}
      <HomeClientAuth />
    </div>
  );
}
