import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { History } from "../history";
import './index.css'
import { useSearchParams } from "react-router-dom";

export const Repositorylist = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fetch, setFetch] = useState(searchParams.get("token")?true:false);

  const [token, setToken] = useState(searchParams.get("token")?`${searchParams.get("token")}`:``);

  const ListRepositories = () => {
      const { loading, error, data } = useQuery(gql`
        {
            repositories(token: "${searchParams.get("token")}"){
              name,
              size,
              owner
            }
          }
        `);
      if (loading) return <div className="repo-list-container">Loading...</div>;
      if (error) return <div className="repo-list-container">Error :(</div>;

      return (
          <>
          <table>
          <tr>
            <th className="table-heading">OWNER</th>
            <th className="table-heading">NAME</th>
            <th className="table-heading">SIZE</th>
            <th className="table-heading">ACTION</th>

          </tr>
          {data.repositories.map(
            (item: {
              size: string;
              owner: number;
              name: string;
              index: number;
            }) => (
              <tbody key={item.index}>
                <td className="table-body">{item.owner}</td>
                <td className="table-body">{item.name}</td>
                <td className="table-body">{item.size}kb</td>
                <td className="table-body">                
                 <button onClick={()=>History.navigate(`/repository-details?repoName=${item.name}&token=${searchParams.get("token")}`)}>
                   Details&nbsp;&gt;&gt;&gt;
                 </button></td>
              </tbody>

            )
          )}
        </table>
          </>
      );
  };

  const onInputChange = (e: any) => {
    setToken(e.target.value);
    const token=e.target.value;
    setSearchParams({token})
    setFetch(false);
  };
  return (
    <div className="repo-list-container">
      {" "}
      <h2>Github Scanner 🚀</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          className="input"
          placeholder="Github Personal access token"
          onChange={(e) => onInputChange(e)}
          value={token}
        ></input>
        <button type="submit" onClick={() => setFetch(true)}>
          Fetch Repositories
        </button>
      </form>
      {fetch &&
      <ListRepositories />
}
    </div>
  );
};
