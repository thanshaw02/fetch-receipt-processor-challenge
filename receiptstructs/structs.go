package receiptstructs

type Item struct {
	ShortDescription string
	Price            string
}

type Receipt struct {
	Id           string `json:"id,omitempty"`
	Retailer     string
	PurchaseDate string
	PurchaseTime string
	Items        []Item
	Total        string
	Points       int `json:"points,omitempty"`
}

type PostResponse struct {
	Id string `json:"id"`
}

type GetResponse struct {
	Points string `json:"points"`
}
