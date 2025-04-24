export default function PostContainer({ title, date, summary }) {
  // Convert Firestore timestamp to a human-readable string if necessary
  const formattedDate = date.toDate ? date.toDate().toLocaleDateString() : date;

  return (
    <div className="m-2 flex flex-col items-start rounded-sm p-5 bg-macchiato-mantle font-['Figtree',sans-serif]">
      <div className="mb-1 text-2xl font-['Figtree',sans-serif]">{title}</div>
      <div className="mb-1 text-sm text-macchiato-subtext0 font-['Figtree',sans-serif]">
        {formattedDate}
      </div>
      <div className="text-md text-macchiato-subtext1 font-['Figtree',sans-serif]">
        {summary}
      </div>
    </div>
  );
}
