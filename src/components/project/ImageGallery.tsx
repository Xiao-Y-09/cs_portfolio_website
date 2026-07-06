import type { ProjectImage } from "@/lib/types";
import SectionTitle from "@/components/ui/SectionTitle";
import PlaceholderImage from "@/components/ui/PlaceholderImage";
import styles from "./ImageGallery.module.css";

interface ImageGalleryProps {
  images: ProjectImage[];
  projectSlug: string;
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section>
      <SectionTitle title="Screenshots" />
      <div className={styles.grid}>
        {images.map((image) => (
          <figure key={image.filename} className={styles.item}>
            <div className={styles.frame}>
              <PlaceholderImage height="240px" />
            </div>
            <figcaption className={styles.caption}>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
