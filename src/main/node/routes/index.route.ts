import { StatusError } from '@errors/status.error';
import { githubService } from '@service';
import { Router } from 'express';
import { graphqlHTTP, OptionsData } from 'express-graphql';
import { buildSchema } from 'graphql';
import httpStatus from 'http-status';

export const router = Router();


let schema = buildSchema(`
  type Query {
      repositories(token: String!): [Repository!]!
  }

  type Repository {
      name: String!
      size: Int!
      owner: String!
  }
`);

var root = {
    repositories: async ({ token }: any) => {
        const user = await githubService.getUser(token);
        return githubService.getUserRepos(token, user.login)
            .then(repositories => repositories.map(
                repository => ({
                    name: repository.name,
                    size: repository.size,
                    owner: repository.owner.login,
                })
            ));
    },
};


router.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
} as OptionsData));

router.use((req, res, next) => next(new StatusError(httpStatus.NOT_FOUND, 'not found')));