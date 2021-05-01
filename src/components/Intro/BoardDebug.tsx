export const BoardDebug = ({ boardSummaryData, boardType }) => {
  const { items, columns } = boardSummaryData;
  return (
    <ul style={{ position: "fixed", right: 0, top: 0 }}>
      <li>Board Type {boardType}</li>
      <li>Items count: {items.length}</li>
      <li>Columns count: {columns.length}</li>
    </ul>
  );
};
