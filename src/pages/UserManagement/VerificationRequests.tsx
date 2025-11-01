import { Can } from "@/components/Can";
import { usePageGrants, useHasGrant } from "@/hooks/usePageGrants";

export default function VerificationRequests() {
  const grants = usePageGrants();
  const { list: canList, export: canExport } = useHasGrant(["list", "export"]);
  const currentPermissionsText = `目前權限: 查看(${canList}), 匯出(${canExport})`;
  return (
    <div>
      Verification Requests
      <pre>{JSON.stringify(grants, null, 2)}</pre>
      <div>{currentPermissionsText}</div>
      <Can grant="list">
        <button>查看</button>
      </Can>
      <Can grant="export" fallback={<button disabled>匯出 (無權限)</button>}>
        <button>匯出</button>
      </Can>
    </div>
  );
}
