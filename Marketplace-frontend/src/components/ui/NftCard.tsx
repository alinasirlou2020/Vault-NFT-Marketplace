import { Link } from "wouter";
import {
  useNftMetadata,
  useCollectionName,
  getNftPlaceholderStyle,
} from "@/hooks/useNftMetadata";
import { formatMatic, shortenAddress, timeAgo } from "@/utils/format";
import { SkeletonCard } from "./SkeletonCard";

interface NftCardProps {
  nftAddress: `0x${string}`;
  tokenId: bigint;
  price: bigint;
  seller: `0x${string}`;
  listedAt: bigint;
}

export function NftCard({
  nftAddress,
  tokenId,
  price,
  seller,
  listedAt,
}: NftCardProps) {
  const { metadata, isLoading } = useNftMetadata(nftAddress, tokenId);
  const { data: collectionName } = useCollectionName(nftAddress);

  if (isLoading) return <SkeletonCard />;

  const placeholderStyle = getNftPlaceholderStyle(
    nftAddress,
    tokenId.toString(),
  );
  const imgUrl = metadata?.image;

  return (
    <Link href={`/nft/${nftAddress}/${tokenId}`}>
      <div className="group cursor-pointer rounded-xl overflow-hidden glass border border-white/5 nft-card relative h-full flex flex-col">
        {/* Image Container */}
        <div className="aspect-square w-full relative overflow-hidden bg-black/40">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={metadata?.name || `Token #${tokenId}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: placeholderStyle }}
            />
          )}

          <div className="absolute top-2.5 left-2.5 flex gap-2">
            <div className="badge-listed px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold shadow-lg backdrop-blur-md">
              For Sale
            </div>
          </div>

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gradient-primary text-white text-xs sm:text-sm font-semibold py-1.5 px-4 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
              Buy Now
            </div>
          </div>
        </div>

        {/* Content - پدینگ‌ها و اندازه‌ها در موبایل کمی فشرده‌تر شدند */}
        <div className="p-3 sm:p-4 flex flex-col gap-1 border-t border-white/5 bg-black/25 flex-1">
          <div className="flex justify-between items-start">
            <div className="text-[11px] sm:text-xs text-white/50 font-medium truncate max-w-[70%]">
              {collectionName || shortenAddress(nftAddress)}
            </div>
            <div className="text-[10px] sm:text-xs text-white/40">
              {timeAgo(listedAt)}
            </div>
          </div>

          <div className="font-semibold text-white truncate text-sm sm:text-base">
            {metadata?.name || `Token #${tokenId.toString()}`}
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs text-white/50">
                Price
              </span>
              <span className="text-neon-purple font-bold text-xs sm:text-sm flex items-center gap-1">
                {formatMatic(price)} MATIC
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] sm:text-xs text-white/50">
                Seller
              </span>
              <Link
                href={`/profile/${seller}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs sm:text-sm text-white/80 hover:text-white hover:underline"
              >
                {shortenAddress(seller)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
