export default function PostContainer({ title, date, summary }) {
  // Convert Firestore timestamp to a human-readable string if necessary
  const formattedDate = date.toDate ? date.toDate().toLocaleDateString() : date;

  return (
    <div className="m-2 flex flex-col items-start rounded-sm p-5 bg-macchiato-mantle">
      <div className="mb-1 text-2xl">{title}</div>
      <div className="mb-1 text-sm text-macchiato-subtext0">
        {formattedDate}
      </div>
      <div className="text-md text-macchiato-subtext1">{summary}</div>
    </div>
  );
}
