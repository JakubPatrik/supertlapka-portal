type VideoPlayerProps = {
  src: string;
};

export function VideoPlayer({ src }: VideoPlayerProps) {
  return (
    <div className="bg-muted aspect-video w-full rounded-md">
      <div
        style={{
          position: 'relative',
          paddingTop: '56.25%',
        }}
      >
        <iframe
          src={src}
          loading="lazy"
          style={{
            border: 0,
            position: 'absolute',
            top: 0,
            height: '100%',
            width: '100%',
            borderRadius: '14px',
          }}
          allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
