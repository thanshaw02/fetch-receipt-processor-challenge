package receiptstructs

 type Item struct {
	ShortDescription string
	Price string
}

type Receipt struct {
	Retailer string
	PurchaseDate string
	PurchaseTime string
	Items []Item
	Total string
}

type IsValidReceiptType struct {
	IsValid bool
	InvalidReason string
}

type ReceiptError struct {
	ErrorType string
	ErrorMessage string
}

type PostResponse struct {
	Id string `json:"id"`
}

type GetResponse struct {
	Points string `json:"points"`
}