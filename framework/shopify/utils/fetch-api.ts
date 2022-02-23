type FetchParams = {
    query: string
}

type FetcherResult<T> = {data: T}

const fetchApi = async <T>({
    query }: FetchParams
    ): Promise<FetcherResult<T>> => {
    const url = 'http://localhost:4000/graphql'

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query
        })
    })

    const {data, errors} = await res.json()
    // ?? is checking the left hand expression is null or undefined. If true it goes with right expression
    // || is checking the left hand expression is null, undefined, "", 0, false. if true goes with right expression
    if (errors) {
        throw new Error(errors[0].message ?? errors.message)
    }

    return { data }
}

export default fetchApi