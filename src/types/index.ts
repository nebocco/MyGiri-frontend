import { Moment } from 'moment'

export interface IAnswer {
    id: number,
    user_id: string,
    display_name?: string
    theme_id: number,
    answer_text: number,
    epoch_submit: string | Moment,
    score: number,
    voted: boolean
}

export interface ITheme {
    id: number,
    user_id: string,
    display_name?: string,
    theme_text: string,
    epoch_open: string | Moment,
}

export interface IVote {
    user_id: string,
    theme_id: number,
    answer_id: number,
    score: number,
}

export interface IProfile {
    user_id: string,
    display_name?: string,
    heart: number,
    star: number,
    answer: number,
    theme: number,
    self_vote: number,
    top_count: number,
}

export default {}