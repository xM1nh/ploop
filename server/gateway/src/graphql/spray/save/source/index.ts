import { AugmentedRequest, RESTDataSource } from '@apollo/datasource-rest'
import { Save } from '../../../../utils/types'
import { ValueOrPromise } from '@apollo/datasource-rest/dist/RESTDataSource'

export default class SaveSource extends RESTDataSource {
    override baseURL = 'http://127.0.0.1:8005/saves/'

    override willSendRequest(path: string, request: AugmentedRequest): ValueOrPromise<void> {
        request.headers['Content-Type'] = 'application/json'
        request.headers['Origin'] = 'http://localhost:8000'
    }

    async getSaves(userId: string, page: number, count: number) {
        return this.get<Save[]>(`?userId=${userId}&page=${page}&count=${count}`)
    }

    async getSave(sprayId: string, userId: string) {
        return this.get<Save>(`${sprayId}?userId=${userId}`)
    }

    async save(sprayId: string, userId: string, notifierId: string) {
        const body = {
            sprayId,
            userId,
            notifierId
        }
        return this.post<Save>(``, {body})
    }

    async unsave(sprayId: string, userId: string) {
        return this.delete<Save>(`?sprayId=${sprayId}&userId=${userId}`)
    }
}