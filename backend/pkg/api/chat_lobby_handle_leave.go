package api

import (
	"github.com/gorilla/websocket"
	. "github.com/trinetco/pax-imperia-clone/pkg/models"
)

func HandleLeaveChatLobby(conn *websocket.Conn) {
	chatRoom := getChatRoomOfClient(conn)

	if chatRoom.ChatLobbyId == "" {
		return
	}

	var userLeaveAnnouncement = Message{
		Command: "SYSTEM_MESSAGE_USER_LEFT_CHAT",
		Payload: map[string]interface{}{
			"status":      "success",
			"chatLobbyId": chatRoom.ChatLobbyId,
			"displayName": clients[conn].DisplayName,
			"email":       clients[conn].Email,
		},
	}

	chatRoom.RemoveClient(conn)

	// if the room is now empty, delete the room
	if len(chatRoom.Clients) == 0 {
		delete(chatRooms, chatRoom.ChatLobbyId)
		return
	}

	SendMessageToAllChatroomParticipants(chatRoom, userLeaveAnnouncement)
}

func getChatRoomOfClient(conn *websocket.Conn) ChatRoom {
	for _, chatRoom := range chatRooms {
		if _, clientFound := chatRoom.Clients[conn]; clientFound {
			return chatRoom
		}
	}
	return ChatRoom{}
}
