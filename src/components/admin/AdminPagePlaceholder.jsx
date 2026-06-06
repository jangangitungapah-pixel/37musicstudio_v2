export default function AdminPagePlaceholder({
  eyebrow = "Admin module",
  title,
  description,
  items = [],
}) {
  return (
    <section className="admin-placeholder-page">
      <div className="admin-placeholder-hero">
        <p className="section-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      {items.length > 0 && (
        <div className="admin-placeholder-grid">
          {items.map((item) => (
            <article className="admin-placeholder-card" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
