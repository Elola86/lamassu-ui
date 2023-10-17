import { Epic } from "redux-observable";
import { RootState } from "../../reducers";
import * as actions from "./actions";
import { filter, exhaustMap, catchError, map } from "rxjs/operators";
import { from, of, tap } from "rxjs";

import * as apicalls from "./apicalls";
import { isActionOf, PayloadAction } from "typesafe-actions";
import { RootAction } from "ducks/actions";

export const getCAs: Epic<RootAction, RootAction, RootState, {}> = (action$, store$) =>
    action$.pipe(
        filter(isActionOf(actions.getCAs.request)),
        tap((item: any) => console.log("%c Epic ", "background:#399999; border-radius:5px;font-weight: bold;", "", item)),
        exhaustMap((action: PayloadAction<string, apicalls.ListRequest>) =>
            from(
                apicalls.getCAs({
                    sortMode: action.payload.sortMode,
                    sortField: action.payload.sortField,
                    limit: action.payload.limit,
                    filters: action.payload.filters,
                    bookmark: action.payload.bookmark
                })
            ).pipe(
                map(actions.getCAs.success),
                tap((item: any) => console.log("%c Epic ", "background:#25eeee; border-radius:5px;font-weight: bold;", "", item)),
                catchError((message) => of(actions.getCAs.failure(message)))
            )
        )
    );

export const triggerGetCAs: Epic<RootAction, RootAction, RootState, {}> = (action$, store$) =>
    action$.pipe(
        filter((rootAction, value) => isActionOf([
            actions.createCA,
            actions.importCAReadonly,
            actions.importCAWithKey,
            actions.updateCAMetadata,
            actions.revokeCA
        ], rootAction)),
        map((val: any) => {
            return actions.getCAs.request({
                sortMode: "asc",
                sortField: "",
                limit: 25,
                filters: [],
                bookmark: ""
            });
        })
    );
