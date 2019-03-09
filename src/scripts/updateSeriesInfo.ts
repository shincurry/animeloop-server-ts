import '../init'
import { Container } from 'typedi'
import { AnilistService } from '../automator/services/AnilistService'
import { SeriesModel } from '../core/database/model/Series'
import { SeriesService } from '../automator/services/SeriesService'
import { delay } from 'bluebird'

const anilistService = Container.get(AnilistService)
const seriesService = Container.get(SeriesService)

async function updateSeriesInfo() {
  const seriesList = await SeriesModel.find({
    anilist_id: { $ne: null },
  })
  for (const series of seriesList) {
    const anilistItem = await anilistService.getInfo(series.anilist_id)
    await seriesService.updateInfoFromAnilistItem(series._id, anilistItem)
    await delay(1000)
    console.log(`updated ${series.title}`)
  }
}

updateSeriesInfo().then(() => {
  console.log('done.')
})
