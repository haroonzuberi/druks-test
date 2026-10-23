'use client'

import { Rating } from 'react-simple-star-rating'

type StarRatingProps = {
  value: number
  size?: number
}

const StarRating = ({ value, size = 22 }: StarRatingProps) => {
  return (
    <span className="inline-block leading-none [&_svg]:inline-block">
      <Rating
        initialValue={value}
        readonly
        allowFraction
        size={size}
        fillColor="#eab308"
        emptyColor="#d1d5db"
        allowHover={false}
        showTooltip={false}
        allowTitleTag={false}
        SVGstyle={{ display: 'inline-block' }}
      />
    </span>
  )
}

export default StarRating
