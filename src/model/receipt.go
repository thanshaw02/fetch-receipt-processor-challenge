package receipt

type Item struct {
	shortDescription string
	price string
}

type Receipt struct {
	retailer string
	purchaseDate string
	purchaseTime string
	items []Item
	total string
}