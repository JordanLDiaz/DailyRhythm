import { dbContext } from "../db/DbContext"
import { BadRequest, Forbidden } from "../utils/Errors.js"

class RhythmService {
    async getMyRhythms(creatorId) {
        const rhythms = await dbContext.Rhythms.find({ creatorId })
        return rhythms
    }

    async getOneRhythm(rhythmId) {
        const rhythm = await dbContext.Rhythms.findById(rhythmId)
        if (!rhythm) throw new BadRequest('No rhythm found.')
        return rhythm
    }

    async createRhythm(body) {
        const rhythm = await dbContext.Rhythms.create(body)
        return rhythm
    }
    async updateRhythm(rhythmId, body, accountId) {
        const currentRhythm = await this.getOneRhythm(rhythmId)
        if (currentRhythm.archived) throw new BadRequest('You cannot edit an archived rhythm.')
        if (accountId != currentRhythm.creatorId) throw new Forbidden('You cannot edit someone elses rhythm.')
        currentRhythm.name = body.name ? body.name : currentRhythm.name
        currentRhythm.description = body.description ? body.description : currentRhythm.description
        currentRhythm.start = body.start ? body.start : currentRhythm.start
        currentRhythm.end = body.end ? body.end : currentRhythm.end
        currentRhythm.completedDate = body.completedDate ? body.completedDate : currentRhythm.completedDate
        currentRhythm.priority = body.priority ? body.priority : currentRhythm.priority
        currentRhythm.accomplished = body.accomplished ? body.accomplished : currentRhythm.accomplished
        currentRhythm.color = body.color ? body.color : currentRhythm.color
        currentRhythm.icon = body.icon ? body.icon : currentRhythm.icon
        await currentRhythm.save()
        return currentRhythm
    }
    async archiveRhythm(rhythmId, accountId) {
        const currentRhythm = await this.getOneRhythm(rhythmId)
        if (accountId != currentRhythm.creatorId) throw new Forbidden('You cannot edit someone elses rhythm.')
        currentRhythm.archived = !currentRhythm.archived
        await currentRhythm.save()
        if (currentRhythm.archived == true) {
            return `archived ${currentRhythm.name}`
        } else {
            return `restored ${currentRhythm.name}`
        }
    }
}

export const rhythmService = new RhythmService