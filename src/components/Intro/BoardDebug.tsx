export const BoardDebug = ({ boardSummaryData, boardType }) => {
  const { items, columns } = boardSummaryData;
  return (
    <ul
      style={{
        position: "fixed",
        zIndex: -1,
        left: "30%",
        top: 0,
        fontSize: "10px",
      }}
    >
      <li>Board Type {boardType}</li>
      <li>Items count: {items.length}</li>
      <li>Columns count: {columns.length}</li>
    </ul>
  );
};
