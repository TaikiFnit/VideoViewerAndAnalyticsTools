module.exports = class VideoModel {
  constructor(databaseMapper) {
    this.databaseMapper = databaseMapper
  }

  async all() {
    const videos = await this.databaseMapper.fetchAllVideos()
    return videos
  }

  async find(id) {
    const video = (await this.databaseMapper.fetchVideoById(id))[0]
    return { ...video }
  }

  async findAllAnalyzableVideos() {
    const sectionSequences = await this.databaseMapper.fetchSectionSequencesOf(
      'sections'
    )
    const visualTransitionSequences = await this.databaseMapper.fetchSectionSequencesOf(
      'visualTransitions'
    )

    const sectionSequencedVideoIds = sectionSequences.map(
      (sequence) => sequence.video_id
    )
    const visualTransitionSequencedVideoIds = visualTransitionSequences.map(
      (sequence) => sequence.video_id
    )

    const a = new Set(sectionSequencedVideoIds)
    const b = new Set(visualTransitionSequencedVideoIds)
    const intersection = new Set([...a].filter((x) => b.has(x)))

    const analyzableVideoIdSet = [...intersection]

    if (analyzableVideoIdSet.length === 0) {
      return []
    }

    const analyzableVideos = await this.databaseMapper.fetchVideosByIds(
      analyzableVideoIdSet
    )

    return analyzableVideos
  }
}
