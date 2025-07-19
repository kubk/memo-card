export function FeatureCard({
  title,
  description,
  imageSrc,
  imageAlt,
}: {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div className="bg-muted/50 flex flex-col p-6 pb-0 rounded-2xl">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="mb-3 text-lg">{description}</p>

      <div className="mt-auto relative flex justify-center">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt || title}
            className="max-h-[400px]"
          />
        )}
      </div>
    </div>
  );
}
