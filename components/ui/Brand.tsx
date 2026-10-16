import Image from "next/image";

function BrandVertical() {
  return (
    <div className="footer-brand">
      <Image
        src="/logo-icon.svg"
        alt="Cardian"
        width={160}
        height={160}
        className="w-40 h-40 pl-10"
      />
      <div className="-mt-8">
        <h3>Cardian 卡典</h3>
        <p className="text-sm -mt-4">做出讓人心動的卡片</p>
      </div>
    </div>
  );
}

function BrandHorizontal() {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-3 no-underline">
        <Image
          src="/logo-icon.svg"
          alt="Cardian"
          width={48}
          height={48}
          className="w-12 h-12"
        />
        <div className="flex flex-col">
          <span className="text-xl font-bold text-deep-brown font-serif leading-tight">
            Cardian 卡典
          </span>
          <span className="text-xs text-text-secondary font-normal leading-tight">
            做出讓人心動的卡片
          </span>
        </div>
      </div>
    </div>
  );
}

const Brand = {
  Vertical: BrandVertical,
  Horizontal: BrandHorizontal,
};

export default Brand;
