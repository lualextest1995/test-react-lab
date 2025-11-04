import { Can } from "@/components/Can";
import { Button } from "@/components/ui/button";
import { usePageGrants, useHasGrant } from "@/hooks/usePageGrants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

export default function VerificationRequests() {
  const queryClient = useQueryClient();
  const [count, setCount] = useState(0);
  const grants = usePageGrants();
  const { list: canList, export: canExport } = useHasGrant(["list", "export"]);
  const currentPermissionsText = `目前權限: 查看(${canList}), 匯出(${canExport})`;

  function getTodos() {
    return axios
      .get("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.data);
  }

  function createTodo() {
    return axios
      .post("https://jsonplaceholder.typicode.com/posts", {
        title: "foo",
        body: "bar",
        userId: 1,
      })
      .then((res) => res.data);
  }

  const { data, error, isFetching, refetch } = useQuery({
    queryKey: ["player-verify-todo", count],
    queryFn: getTodos,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["player-verify-todo"] });
    },
    onError: (error) => {
      console.error("Error creating todo:", error);
    },
    onSettled: () => {
      console.log("Mutation settled");
    },
  });
  return (
    <div>
      Verification Requests
      <pre>{JSON.stringify(grants, null, 2)}</pre>
      <div>{currentPermissionsText}</div>
      <Can grant="list">
        <Button>查看</Button>
      </Can>
      <Can grant="export" fallback={<Button disabled>匯出 (無權限)</Button>}>
        <Button>匯出</Button>
      </Can>
      <Button onClick={() => setCount(count + 1)}>Count: {count}</Button>
      {isFetching && <div>Loading...</div>}
      {error && <div>Error fetching data</div>}
      {data && <p>{data[0].title}</p>}
      <Button onClick={() => refetch()}>Refetch Data</Button>
      <Button onClick={() => mutateAsync()} disabled={isPending}>
        {isPending ? "Creating..." : "Create Todo"}
      </Button>
    </div>
  );
}
