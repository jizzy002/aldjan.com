import RainEffect from './RainEffect';

export default function RainSection({ colors }) {
  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        backgroundColor: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderTop: `1px solid ${colors.borderColor || 'rgba(255, 255, 255, 0.1)'}`
      }}
    >
      <RainEffect />
    </section>
  );
}
