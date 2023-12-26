package api

import (
	"fmt"

	"github.com/gorilla/websocket"
	. "github.com/trinetco/pax-imperia-clone/pkg/models"
	"github.com/trinetco/pax-imperia-clone/pkg/util"
)

func HandleJoinChatLobby(conn *websocket.Conn, message Message) {
	// fmt.Println("Chat Room ID:", chatLobbyId)
	chatLobbyId, error := validateInputs(message)
	if error != nil {
		fmt.Println(error)
		return
	}

	chatRoom := findOrCreateChatRoom(chatLobbyId)

	// Check if the client has already joined the lobby
	if _, clientFound := chatRoom.Clients[conn]; clientFound {
		fmt.Println("Warn: Client attempted to join lobby but was already there")
		return
	}

	// Add the joining client to the chat room
	chatRoom.Clients[conn] = clients[conn]
	chatRooms[chatLobbyId] = chatRoom

	respondToJoiner(conn, chatRoom)

	announceUserJoinedChat(conn, chatRoom)

	fmt.Printf("Client joined lobby: %s -> %s\n", clients[conn].DisplayName, chatLobbyId)
}

func validateInputs(message Message) (string, error) {
	chatLobbyId, ok := message.Payload["chatLobbyId"].(string)

	if !ok {
		msg := "Error: Chat Room ID not found or not a string"
		return "", fmt.Errorf(msg)
	}

	return chatLobbyId, nil
}

func findOrCreateChatRoom(chatLobbyId string) ChatRoom {
	chatRoom, exists := chatRooms[chatLobbyId]

	if !exists {
		fmt.Printf("Creating lobby: %s\n", chatLobbyId)

		chatRoom = ChatRoom{
			Name:        chatLobbyId,
			Clients:     make(map[*websocket.Conn]ClientData),
			ChatLobbyId: chatLobbyId,
		}
	}

	return chatRoom
}

func respondToJoiner(conn *websocket.Conn, chatRoom ChatRoom) {
	var response = Message{
		Command: "JOIN_CHAT_LOBBY_RESPONSE",
		Payload: map[string]interface{}{
			"status":         "success",
			"chatLobbyId":    chatRoom.ChatLobbyId,
			"chatLobbyUsers": GetChatLobbyUsers(chatRoom),
			"message":        "Joined chat lobby",
		},
	}

	if serverConfiguration.VerboseMode {
		util.DebugPrintStruct(response)
	}

	conn.WriteJSON(response)
}

func announceUserJoinedChat(conn *websocket.Conn, chatRoom ChatRoom) {
	var userJoinAnnouncement = Message{
		Command: "SYSTEM_MESSAGE_USER_JOINED_CHAT",
		Payload: map[string]interface{}{
			"status":      "success",
			"chatLobbyId": chatRoom.ChatLobbyId,
			"displayName": clients[conn].DisplayName,
			"email":       clients[conn].Email,
		},
	}

	SendMessageToAllButOneChatroomParticipant(chatRoom, userJoinAnnouncement, conn)
}